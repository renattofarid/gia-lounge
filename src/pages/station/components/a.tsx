          <div className="w-full flex flex-wrap gap-2 mb-6">
            <Select onValueChange={handleFilterTypeChange} value={filterType}>
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="reserved">Reservados</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleEnvironmentChange}
              value={environmentId ? environmentId.toString() : "all"}
            >
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Salón principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Ver todos</SelectItem>
                {environments.map((env) => (
                  <SelectItem key={env.id} value={env.id.toString()}>
                    {env.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[150px] justify-start text-left font-normal bg-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? (
                    format(date, "dd/MM/yyyy", { locale: es })
                  ) : (
                    <span>22/11/2024</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => handleSelectDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>